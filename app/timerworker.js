let intervalID = null;
let remainingTime = 0;

self.onmessage = (event) => {
    if (event.data.action === 'start') {
        remainingTime = event.data.duration;
        startTimer();
    } else if (event.data.action === 'pause') {
        clearInterval(intervalID);
        self.postMessage({ remainingTime });
    } else if (event.data.action === 'resume') {
        startTimer();
    }
};

function startTimer() {
    intervalID = setInterval(() => {
        if (remainingTime > 0) {
            remainingTime--;
            self.postMessage({ remainingTime });
        } else {
            clearInterval(intervalID);
            self.postMessage({ done: true });
        }
    }, 1000);
}