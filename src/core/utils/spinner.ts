export function withSpinner(asyncFn, ...args) {
  let spinnerIndex = 0;
  const spinner = ["|", "/", "-", "\\"];
  const messages = [
    "Hold on tight, we're getting things ready...",
    "Grab a bubble tea 🧋, this will take a moment...",
    "Calmate y tomate un mate 🧉, this will take a moment...",
    "Just a bit of magic happening behind the scenes...",
    "Good things come to those who wait... just a little longer!",
    "Making sure everything is perfect for you...",
    "Hang tight! ⏳ - We're processing your request...",
    "Loading... the best things are worth waiting for!",
    "Working hard to bring you awesome results...",
    "Taking a moment to polish things up...",
    "Almost there... preparing something special for you!",
  ];

  const message = messages[Math.floor(Math.random() * messages.length)];

  const interval = setInterval(() => {
    process.stdout.write(`\r${spinner[spinnerIndex]} ${message}`);
    spinnerIndex = (spinnerIndex + 1) % spinner.length;
    process.stdout.write("\x1B[K");
  }, 100);

  return (async () => {
    try {
      return await asyncFn(...args);
    } finally {
      clearInterval(interval);
      process.stdout.write("\r\x1B[K");
    }
  })();
}
