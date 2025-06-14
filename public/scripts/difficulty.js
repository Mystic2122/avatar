const express = require('express');


function selectDifficulty(level) {
  console.log("Redirecting to game with difficulty:", level);
  window.location.href = `/game?difficulty=${level}`;
}