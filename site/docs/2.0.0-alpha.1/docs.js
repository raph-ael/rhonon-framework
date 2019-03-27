var codes = document.querySelectorAll('pre code');

function addButton(id) {
  var container = document.createElement('div');
  container.classList.add('w-100');
  container.classList.add('mt-3');
  container.classList.add('text-right');

  var btn = document.createElement('button');
  btn.classList.add('btn');
  btn.classList.add('btn-sm');
  btn.classList.add('btn-secondary');

  btn.setAttribute('id', id);

  btn.innerHTML = 'Copy';

  container.appendChild(btn);

  return container;
}

function setPosition(btn) {
  var rect = btn.getBoundingClientRect();
  var el = btn;

  // el.style.marginLeft = '-' + rect.width + 'px';
}

function setListener(btnId, code) {
  var clipboard = new ClipboardJS(btnId, {
    target: function() {
      return code;
    }
  });

  clipboard.on('success', function (event) {
    event.clearSelection();
  });

  document.querySelector(btnId).addEventListener('click', function (event) {
    var text = event.target.innerHTML;
    event.target.innerHTML = 'Copied';
    setTimeout(function () {
      event.target.innerHTML = text;
    }, 1000);
  });
}

if (codes) {
  codes.forEach(function (code) {
    hljs.highlightBlock(code);

    var btnId = Math.random().toString(36).substring(0, 20).replace(/[0-9.]/g, '');
    var page = code.parentNode.parentNode;

    page.insertBefore(addButton(btnId), code.parentNode.previousSibling);
    setPosition(document.querySelector('#' + btnId));
    setListener('#' + btnId, code);
  });
}

// iframes
function setWidth(iframe, size) {
  if (!size) {
    return;
  }

  iframe.setAttribute('class', 'iframe-example');
  iframe.classList.add(size);
}

var iframeContainers = document.querySelectorAll('.iframe-container');

if (iframeContainers) {
  iframeContainers.forEach(function (iframeContainer) {
    iframeContainer.querySelector('.btn-group').addEventListener('click', function (event) {
      var iframe = iframeContainer.querySelector('iframe');
      setWidth(iframe, event.target.getAttribute('data-size'));
    });
  });
}
