const axios = require("axios");
require("dotenv").config();

const HF_API_TOKEN = process.env.HF_API_TOKEN;

const weights = {
  cohesion: 5,
  syntax: 3,
  vocabulary: 5,
  phraseology: 2,
  grammar: 3,
  conventions: 2,
};

const scaleScores = (scores) => {
  const minScore = Math.min(...scores);
  const maxScore = Math.max(...scores);

  if (minScore === maxScore) {
    return scores.map(() => 3); // Set all scores to a neutral value
  }

  return scores.map(
    (score) => 1 + 4 * (score - minScore) / (maxScore - minScore)
  );
};

const evaluateEssay = async (text) => {
  try {
    let response;
    let isLoading = true;

    while (isLoading) {
      response = await axios.post(
        "https://api-inference.huggingface.co/models/KevSun/Engessay_grading_ML",
        { inputs: text },
        {
          headers: {
            Authorization: `Bearer ${HF_API_TOKEN}`,
          },
        }
      );

      if (response.data.error && response.data.error.includes("currently loading")) {
        console.log(
          `Model is loading, retrying in ${response.data.estimated_time || 10} seconds...`
        );
        await new Promise((resolve) =>
          setTimeout(resolve, (response.data.estimated_time || 10) * 1000)
        );
      } else {
        isLoading = false;
      }
    }

    const itemNames = ["cohesion", "syntax", "vocabulary", "phraseology", "grammar", "conventions"];
    const rawScores = response.data[0].map((result) => result.score);

    // Scale and normalize the scores
    const scaledScores = scaleScores(rawScores);

    // Round to nearest 0.5
    const roundedScores = scaledScores.map((score) => Math.round(score * 2) / 2);

    const scores = roundedScores.map((score, index) => ({
      label: itemNames[index],
      score,
    }));

    // Compute cumulative score
    const cumulativeScore = scores.reduce(
      (total, item) => total + item.score * weights[item.label],
      0
    );

    return {
      scores,
      cumulativeScore: Math.round(cumulativeScore), // Round cumulative score to 1 decimal place
    };
  } catch (error) {
    console.error("Error during analysis:", error.response?.data || error.message);
    throw new Error("Failed to analyze writing.");
  }
};


module.exports = { evaluateEssay };
