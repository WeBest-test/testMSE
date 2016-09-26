(function() {
  $(document).ready(function ($) {
    var video = document.querySelector('video');

    // var assetURL = 'http://127.0.0.1:8080/mp4/frag_bunny.mp4';
    var assetURL = 'http://127.0.0.1:8080/mp4/long.mp4';
    // Need to be specific for Blink regarding codecs
    // ./mp4info frag_bunny.mp4 | grep Codec
    // var mimeCodec = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"';
    var mimeCodec = 'video/mp4; codecs="avc1.42E01E"';

    if ('MediaSource' in window && MediaSource.isTypeSupported(mimeCodec)) {
      var mediaSource = new MediaSource;
      //console.log(mediaSource.readyState); // closed
      video.src = URL.createObjectURL(mediaSource);
      mediaSource.addEventListener('sourceopen', sourceOpen);
    } else {
      console.error('Unsupported MIME type or codec: ', mimeCodec);
    }

    function sourceOpen (_) {
      //console.log(this.readyState); // open
      var mediaSource = this;
      var sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);
      fetchAB(assetURL, function (buf) {
        
          video.play();
          console.log(buf)
        sourceBuffer.appendBuffer(buf);
      });


      sourceBuffer.addEventListener('updateend', function (_) {
          mediaSource.endOfStream();
          //console.log(mediaSource.readyState); // ended
      });
    };

    function fetchAB (url, cb) {
      console.log(url);
      var xhr = new XMLHttpRequest;
      xhr.open('get', url);
      xhr.responseType = 'arraybuffer';
      xhr.onload = function () {
        cb(xhr.response);
      };
      xhr.send();
    };
  });
})();