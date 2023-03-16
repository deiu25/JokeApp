class VoiceRSS {
  static speech(settings) {
    this._validate(settings);
    this._request(settings);
  }

  static _validate(settings) {
    if (!settings) throw new Error("The settings are undefined");
    if (!settings.key) throw new Error("The API key is undefined");
    if (!settings.src) throw new Error("The text is undefined");
    if (!settings.hl) throw new Error("The language is undefined");
    if (settings.c && "auto" !== settings.c.toLowerCase()) {
      let supported = false;
      switch (settings.c.toLowerCase()) {
        case "mp3":
          supported = new Audio().canPlayType("audio/mpeg").replace("no", "");
          break;
        case "wav":
          supported = new Audio().canPlayType("audio/wav").replace("no", "");
          break;
        case "aac":
          supported = new Audio().canPlayType("audio/aac").replace("no", "");
          break;
        case "ogg":
          supported = new Audio().canPlayType("audio/ogg").replace("no", "");
          break;
        case "caf":
          supported = new Audio().canPlayType("audio/x-caf").replace("no", "");
          break;
        default:
          supported = false;
      }
      if (!supported)
        throw new Error(
          "The browser does not support the audio codec " + settings.c
        );
    }
  }

  static _request(settings) {
    const params = this._buildRequest(settings);
    const xhr = this._getXHR();

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        if (xhr.responseText.startsWith("ERROR"))
          throw new Error(xhr.responseText);
        new Audio(xhr.responseText).play();
      }
    };

    xhr.open("POST", "https://api.voicerss.org/", true);
    xhr.setRequestHeader(
      "Content-Type",
      "application/x-www-form-urlencoded; charset=UTF-8"
    );
    xhr.send(params);
  }

  static _buildRequest(settings) {
    const codec =
      settings.c && "auto" !== settings.c.toLowerCase()
        ? settings.c
        : this._detectCodec();
    return `key=${settings.key || ""}&src=${settings.src || ""}&hl=${
      settings.hl || ""
    }&v=${settings.v || ""}&r=${settings.r || ""}&c=${codec || ""}&f=${
      settings.f || ""
    }&ssml=${settings.ssml || ""}&b64=true`;
  }

  static _detectCodec() {
    const audio = new Audio();
    return audio.canPlayType("audio/mpeg").replace("no", "")
      ? "mp3"
      : audio.canPlayType("audio/wav").replace("no", "")
      ? "wav"
      : audio.canPlayType("audio/aac").replace("no", "")
      ? "aac"
      : audio.canPlayType("audio/ogg").replace("no", "")
      ? "ogg"
      : audio.canPlayType("audio/x-caf").replace("no", "")
      ? "caf"
      : "";
  }

  static _getXHR() {
    try {
      return new XMLHttpRequest();
    } catch (e) {
      throw new Error("The browser does not support HTTP request");
    }
  }
}

export default VoiceRSS;
