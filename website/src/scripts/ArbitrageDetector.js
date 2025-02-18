async function arbitrageExists(odd1, odd2) {
    let percentage1, percentage2;

    if (odd1 < 0) {
      percentage1 = 1 - 100 / (100 + Math.abs(odd1));
    } else {
      percentage1 = 100 / (100 + odd1);
    }
  
    if (odd2 < 0) {
      percentage2 = 1 - 100 / (100 + Math.abs(odd2));
    } else {
      percentage2 = 100 / (100 + odd2);
    }
  
    const combinedPercentage = percentage1 + percentage2;
    return {
      percent: 1 - combinedPercentage,
      exists: combinedPercentage < 1,
    };
  }
  
  
  async function detectArbitrage(data) {
    const results = [];
  
    // Use a nested loop with await to process arbitrage detection
    for (let i = 0; i < data.length; i++) {
      for (let j = i + 1; j < data.length; j++) {
        const row1 = data[i];
        const row2 = data[j];
       
    
        if (
          row1["betType"] === row2["betType"] &&
          row1["betInfo"] !== row2["betInfo"] &&
          row1["team1"] === row2["team1"] &&
          row1["team2"] === row2["team2"] &&
          row1["dateOfGame"] === row2["dateOfGame"] &&
          row1["sport"] === row2["sport"] &&
          row1["sportsbookName"] !== row2["sportsbookName"]
        ) {
          const odd1 = parseInt(row1["odds"], 10);
          const odd2 = parseInt(row2["odds"], 10);

        
          const { percent, exists } = await arbitrageExists(odd1, odd2); // Ensure arbitrageExists is asynchronous
  
          if (exists) {
            results.push({ percent, row1, row2 });
          }
        }
      }
    }
  
    return results; // Resolves when all results are processed
  }
  
  
  // Export the functions for use in other files
  export { arbitrageExists, detectArbitrage };
  