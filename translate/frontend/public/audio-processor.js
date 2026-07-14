class AudioProcessor extends AudioWorkletProcessor {
  constructor(options) {
    super(options);

    this.inputSampleRate = options.processorOptions.inputSampleRate;
    this.targetSampleRate = options.processorOptions.targetSampleRate;
    this.buffer = [];
    this.totalInputSamples = 0;
    this.totalOutputSamples = 0;

    this.port.onmessage = (event) => {
      if (event.data.command === "stop") {
        this.flush();
      }
    };
  }

  // Linear-interpolation resampling.
  resample(inputBuffer) {
    const inputLength = inputBuffer.length;
    const outputLength = Math.floor(
      (inputLength * this.targetSampleRate) / this.inputSampleRate
    );
    if (outputLength === 0) {
      return new Float32Array(0);
    }
    const outputBuffer = new Float32Array(outputLength);
    for (let i = 0; i < outputLength; i++) {
      const t = (i * (inputLength - 1)) / (outputLength - 1);
      const index = Math.floor(t);
      const frac = t - index;
      const val1 = inputBuffer[index];
      const val2 = inputBuffer[index + 1];

      if (val2 === undefined) {
        outputBuffer[i] = val1;
      } else {
        outputBuffer[i] = val1 + (val2 - val1) * frac;
      }
    }
    return outputBuffer;
  }

  floatTo16BitPCM(input) {
    const output = new Int16Array(input.length);
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]));
      output[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return output;
  }

  // Resample and post whatever audio is still buffered.
  flush() {
    if (this.buffer.length > 0) {
      const concatenatedBuffer = new Float32Array(this.buffer.length);
      let offset = 0;
      for (const buffer of this.buffer) {
        concatenatedBuffer.set(buffer, offset);
        offset += buffer.length;
      }
      const resampled = this.resample(concatenatedBuffer);
      if (resampled.length > 0) {
        const pcmData = this.floatTo16BitPCM(resampled);
        this.port.postMessage(pcmData.buffer, [pcmData.buffer]);
      }
      this.buffer = [];
    }
  }

  process(inputs, outputs, parameters) {
    // Only the first channel of the first input is used.
    const inputChannel = inputs[0][0];

    if (inputChannel) {
      if (this.inputSampleRate === this.targetSampleRate) {
        const pcmData = this.floatTo16BitPCM(inputChannel);
        this.port.postMessage(pcmData.buffer, [pcmData.buffer]);
      } else {
        const resampled = this.resample(inputChannel);
        if (resampled.length > 0) {
          const pcmData = this.floatTo16BitPCM(resampled);
          this.port.postMessage(pcmData.buffer, [pcmData.buffer]);
        }
      }
    }

    // Keep the processor alive; the main thread stops it explicitly.
    return true;
  }
}

registerProcessor("audio-processor", AudioProcessor);
