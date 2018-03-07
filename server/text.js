async function start () {
  await loop();
}

function loop () {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('Start');
      resolve();
    }, 1000);
  });
}

start();