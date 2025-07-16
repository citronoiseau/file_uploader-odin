function formatSize(sizeInMB) {
  const bytes = sizeInMB;
  if (bytes < 1024) return bytes.toFixed(0) + " B";
  const kb = bytes / 1024;
  if (kb < 1024) return kb.toFixed(1) + " KB";
  const mb = kb / 1024;
  if (mb < 1024) return mb.toFixed(1) + " MB";
  const gb = mb / 1024;
  return gb.toFixed(2) + " GB";
}

module.exports = formatSize;
