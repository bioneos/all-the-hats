function createRichBeepSequence() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const baseFrequency = 220; // A3 note
    const majorScale = [1, 9 / 8, 5 / 4, 4 / 3, 3 / 2, 5 / 3]; // Frequency ratios for a major scale
    const duration = 0.3; // Duration of each beep

    function createBeep(frequency) {
        let startTime = audioContext.currentTime;
        const oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(frequency, startTime);

        const gainNode = audioContext.createGain();
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.5, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        const filter = audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(frequency * 2, startTime);
        filter.Q.setValueAtTime(10, startTime);

        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start(startTime);
        oscillator.stop(startTime + duration);
    }

    function createBuzzer() {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        const buzzerDurationSeconds = 0.3;

        oscillator.type = 'square';
        oscillator.frequency.value = 140;
        gainNode.gain.value = 0.3;

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.start();
        oscillator.stop(audioContext.currentTime + buzzerDurationSeconds);
    }

    return {
        beep(index) {
            const frequency = baseFrequency * majorScale[index];
            createBeep(frequency);
        },

        beepDown(index) {
            const downDurationSeconds = 0.2;

            for (let i = index; i >= 0; i--) {
                const frequencyRatio = majorScale[i];
                const frequency = baseFrequency * frequencyRatio;

                setTimeout(() => {
                    createBeep(frequency);
                }, downDurationSeconds * 1000 * (index - i));
            }

            setTimeout(() => {
                createBuzzer();
            }, downDurationSeconds * 1000 * (index + 1));
        }
    };
}

/**
 * Usage example
 */

// beeper = createRichBeepSequence();
// beeper.beep(0);
