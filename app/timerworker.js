let intervalID = null;
let remainingTime = 0;

self.onmessage = (event) => {
    if (event.data.action === 'start') {
        console.log('Received message:', event.data);
        remainingTime = event.data.duration;
        startTimer();
    } else if (event.data.action === 'pause') {
        clearInterval(intervalID);
        self.postMessage({ remainingTime });
    } else if (event.data.action === 'resume') {
        startTimer();
    }
    else if (event.data.action === 'reset') {
        clearInterval(intervalID);
        remainingTime = 0; // Reset remaining time
        self.postMessage({ reset: true }); // Send updated remaining time
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