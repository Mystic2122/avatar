const express = require('express');


function selectDifficulty(level) {
  window.location.href = `/play?difficulty=${level}`;
}