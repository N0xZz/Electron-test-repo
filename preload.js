// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

var node_xj = require("xls-to-json");


window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
  const dropzone = document.getElementById("dropzone");
 console.log(dropzone);


 document.body.addEventListener("dragover", evt => {  /*This is necessary otherwise the 'drop' listener wont work */
  evt.preventDefault();
});

dropzone.addEventListener("drop", (e) =>{
  e.stopPropagation();
  e.preventDefault();

  const files = e.dataTransfer.files;
    
    for (const file of files){
      
      node_xj(
        {
          input: file.path,
          output: file.path.split('.')[0] + ".json",
          sheet: "MediaAssets_Master_new",
          allowEmptyKey: false,
        },
        function (err,result) {
          if(err){console.log(err);}
        }
      )
     }
  })
})





