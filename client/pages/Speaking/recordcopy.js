"use client";

import { useState, useRef } from "react";

const AzureSpeechAssessment = () => {
  const [subscriptionKey, setSubscriptionKey] = useState(
    process.env.NEXT_PUBLIC_AZURE_SUBSCRIPTION_KEY
  );
  const [region, setRegion] = useState("centralindia");
  const [language, setLanguage] = useState("en-us");
  const [referenceText, setReferenceText] = useState("Good morning.");
  const [recordingStatus, setRecordingStatus] = useState("Not recording");
  const [results, setResults] = useState(
    "Results will appear here after processing."
  );
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      // Reset previous recording data
      setAudioUrl(null);
      setResults("Results will appear here after processing.");

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current);
        const blob2 = new Blob(audioChunksRef.current, { type: "audio/wav" });
        console.log(blob2);
        const audioUrl = URL.createObjectURL(blob2);
        setAudioUrl(audioUrl);
        azureApi(blob2);
      };

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingStatus("Recording... Speak now!");
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setRecordingStatus(`Error: ${error.message}`);
    }
  };

  const stopRecording = async () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingStatus("Processing audio...");
    }
  };

  function convertToWav(blob) {
    return new Promise((resolve) => {
      const fileReader = new FileReader();

      fileReader.onloadend = () => {
        const arrayBuffer = fileReader.result;
        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();

        audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
          // Convert to 16kHz mono PCM
          const sampleRate = 16000;
          const numberOfChannels = 1;
          const length =
            audioBuffer.length * (sampleRate / audioBuffer.sampleRate);
          const offlineContext = new OfflineAudioContext(
            numberOfChannels,
            length,
            sampleRate
          );

          const source = offlineContext.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(offlineContext.destination);
          source.start(0);

          offlineContext.startRendering().then((renderedBuffer) => {
            // Create WAV file
            const wavData = createWaveFileData(renderedBuffer);
            const wavBlob = new Blob([wavData], { type: "audio/wav" });
            resolve(wavBlob);
          });
        });
      };

      fileReader.readAsArrayBuffer(blob);
    });
  }

  function createWaveFileData(audioBuffer) {
    const numChannels = 1; // Mono
    const sampleRate = audioBuffer.sampleRate;
    const bitsPerSample = 16;
    const bytesPerSample = bitsPerSample / 8;
    const blockAlign = numChannels * bytesPerSample;
    const byteRate = sampleRate * blockAlign;

    const samples = audioBuffer.getChannelData(0);
    const buffer = new ArrayBuffer(44 + samples.length * bytesPerSample);
    const view = new DataView(buffer);

    // Write WAV header
    writeString(view, 0, "RIFF");
    view.setUint32(4, 36 + samples.length * bytesPerSample, true);
    writeString(view, 8, "WAVE");
    writeString(view, 12, "fmt ");
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM format
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, byteRate, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitsPerSample, true);
    writeString(view, 36, "data");
    view.setUint32(40, samples.length * bytesPerSample, true);

    // Write PCM samples
    const offset = 44;
    for (let i = 0; i < samples.length; i++) {
      const sample = Math.max(-1, Math.min(1, samples[i]));
      const int16Sample = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset + i * bytesPerSample, int16Sample, true);
    }

    return buffer;
  }

  function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  async function azureApi(blob) {
    if (!subscriptionKey) {
      statusElement.textContent =
        "Error: Please enter your Azure subscription key";
      return;
    }

    try {
      // Convert to proper format
      const wavBlob = await convertToWav(blob);

      // Create pronunciation assessment parameters
      const pronAssessmentParamsJson = JSON.stringify({
        ReferenceText: referenceText,
        GradingSystem: "HundredMark",
        Dimension: "Comprehensive",
        EnableMiscue: true,
        EnableProsodyAssessment: true,
      });

      const pronAssessmentParams = btoa(pronAssessmentParamsJson);
      const sessionID = generateUUID();

      // Create request URL
      const url = `https://${region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=${language}&format=detailed&X-ConnectionId=${sessionID}`;

      //statusElement.textContent = "Sending to Azure Speech API...";

      // Send request
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json;text/xml",
          "Content-Type": "audio/wav; codecs=audio/pcm; samplerate=16000",
          "Ocp-Apim-Subscription-Key": subscriptionKey,
          "Pronunciation-Assessment": pronAssessmentParams,
        },
        body: wavBlob,
      });

      if (response.ok) {
        const result = await response.json();

        const nBest = result.NBest?.[0] || {};
        const extractedScores = {
          AccuracyScore: nBest.AccuracyScore || 0,
          FluencyScore: nBest.FluencyScore || 0,
          ProsodyScore: nBest.ProsodyScore || 0,
          CompletenessScore: nBest.CompletenessScore || 0,
          PronScore: nBest.PronScore || 0,
        };

        const resultText = JSON.stringify(result, null, 2);
        setResults(extractedScores);
      } else {
        const errorText = await response.text();
        console.log(errorText);
      }
    } catch (error) {
      console.error("Error sending to Azure:", error);
    }
  }

  function generateUUID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  // Inside your sendToAzureSpeechAPI function in the frontend component:

  const sendToAzureSpeechAPI = async (blob) => {
    if (!subscriptionKey) {
      setRecordingStatus("Error: Please enter your Azure subscription key");
      return;
    }

    try {
      // Create a proper file from the blob to send to the server
      // This ensures the backend receives a proper file rather than just a blob
      const audioFile = new File([blob], "recording.wav", {
        type: "audio/wav",
      });

      const formData = new FormData();
      formData.append("audio", audioFile);
      formData.append("referenceText", referenceText);
      formData.append("language", language);
      formData.append("region", region);
      formData.append("subscriptionKey", subscriptionKey);

      setRecordingStatus("Sending audio to server...");

      // Send to our API route
      const response = await fetch("/api/azure-speech", {
        method: "POST",
        body: formData,
      });

      // Validate response before parsing
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}. ${errorText}`);
      }

      const data = await response.json();
      setResults(JSON.stringify(data, null, 2));
      setRecordingStatus("Processing complete");
    } catch (error) {
      console.error("Error sending audio to Azure:", error);
      setRecordingStatus(`Error: ${error.message}`);
    }
  };

  const handleMagic = async () => {
    if (!audioBlob) {
      setRecordingStatus("Error: No recorded audio available.");
      return;
    }

    await sendToAzureSpeechAPI(audioBlob);
  };

  return (
    <div className="max-w-xl mx-auto p-4 bg-gray-100 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">
        Azure Speech Pronunciation Assessment
      </h1>
      <div className="mb-4">
        <label className="block font-semibold">Reference Text:</label>
        <textarea
          className="w-full p-2 border rounded"
          rows="3"
          value={referenceText}
          onChange={(e) => setReferenceText(e.target.value)}
        />
      </div>
      <div className="flex space-x-2">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
          onClick={startRecording}
          disabled={isRecording}
        >
          Start Recording
        </button>
        <button
          className="bg-red-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
          onClick={stopRecording}
          disabled={!isRecording}
        >
          Stop Recording
        </button>
      </div>
      <p className="mt-4 text-red-600 font-bold">{recordingStatus}</p>

      {audioUrl && (
        <div className="mt-4">
          <h3 className="font-bold">Audio Preview:</h3>
          <audio controls src={audioUrl} className="w-full mt-2" />
        </div>
      )}

      <div className="mt-4 p-4 bg-white rounded border">
        <h3 className="font-bold">Assessment Results:</h3>
        <pre className="text-sm overflow-auto">
          {results && (
            <div>
              <h3>Speech Assessment Scores</h3>
              <p>Accuracy Score: {results.AccuracyScore}</p>
              <p>Fluency Score: {results.FluencyScore}</p>
              <p>Prosody Score: {results.ProsodyScore}</p>
              <p>Completeness Score: {results.CompletenessScore}</p>
              <p>Pronunciation Score: {results.PronScore}</p>
            </div>
          )}
        </pre>
      </div>
    </div>
  );
};

export default AzureSpeechAssessment;
