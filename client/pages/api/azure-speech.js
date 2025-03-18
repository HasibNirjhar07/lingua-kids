// // File: pages/api/azure-speech.js

// import formidable from 'formidable';
// import fs from 'fs';

// // Disable the default body parser to handle form data with files
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   try {
//     // Parse the form data
//     const form = formidable({});
//     const [fields, files] = await new Promise((resolve, reject) => {
//       form.parse(req, (err, fields, files) => {
//         if (err) reject(err);
//         resolve([fields, files]);
//       });
//     });

//     // Get the audio file and other fields
//     const audioFile = files.audio?.[0];  // formidable v4 returns arrays for files
//     const referenceText = fields.referenceText?.[0];
//     const language = fields.language?.[0];
//     const region = fields.region?.[0];
//     const subscriptionKey = fields.subscriptionKey?.[0];

//     // Validate required fields
//     if (!audioFile || !referenceText || !language || !region || !subscriptionKey) {
//       return res.status(400).json({ error: 'Missing required parameters' });
//     }

//     // Read the audio file
//     const audioBuffer = fs.readFileSync(audioFile.filepath);

//     // Create the Azure Speech API URL
//     const apiUrl = `https://${region}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1`;
    
//     // Set up query parameters
//     const params = new URLSearchParams({
//       'language': language,
//       'format': 'detailed'
//     });
    
//     // Parameters for pronunciation assessment
//     const pronunciationAssessmentParams = {
//       ReferenceText: referenceText,
//       GradingSystem: 'HundredMark',
//       Granularity: 'Phoneme',
//       EnableMiscue: true
//     };

//     console.log('Making request to Azure Speech API...');
//     console.log(`URL: ${apiUrl}?${params.toString()}`);
    
//     // Make request to Azure Speech API
//     const response = await fetch(`${apiUrl}?${params.toString()}`, {
//       method: 'POST',
//       headers: {
//         'Ocp-Apim-Subscription-Key': subscriptionKey,
//         'Content-Type': 'audio/wav',
//         'Accept': 'application/json',
//         'Pronunciation-Assessment': JSON.stringify(pronunciationAssessmentParams)
//       },
//       body: audioBuffer
//     });

//     // Handle response
//     if (!response.ok) {
//       const errorData = await response.text();
//       console.error('Azure API error:', errorData);
//       return res.status(response.status).json({
//         error: `Azure API error: ${response.status}`,
//         details: errorData
//       });
//     }

//     const data = await response.json();
//     console.log('Azure Speech API response received');
    
//     // Clean up the temporary file
//     fs.unlinkSync(audioFile.filepath);
    
//     return res.status(200).json(data);
//   } catch (error) {
//     console.error('Server error:', error);
//     return res.status(500).json({ error: error.message, stack: error.stack });
//   }
// }