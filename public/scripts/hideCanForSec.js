const hideCanForSec = function() {
  const waterCan = document.querySelector("#water-can");
  waterCan.style["visibility"] = "hidden";
  return setTimeout(() => {
    waterCan.style["visibility"] = "visible";
  }, 1000);
};
