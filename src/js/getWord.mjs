export default class GetWord {
  async GetTheWord(word) {
    const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Word not found");

      const data = await response.json();
      const wordName = data[0].word;
      const meaning = data[0].meanings[0].definitions[0].definition;

    
      return { wordName, meaning };

    } catch (err) {
      console.error(err);

      return {
        wordName: "serendipity",
        meaning: "unknown error"
      };
    }
  }
}
