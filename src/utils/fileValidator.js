const validateFile = (file, fileType, fileSize) => {
  const SUCCESS = 0
  const FILE_TYPE_ERROR = 1
  const FILE_SIZE_ERROR = 2
  const validateMessage = {
    0: '',
    1: `File must be ${fileType}`,
    2: `File must not exceed ${fileSize / (1024 * 1024)}MB`
  }

  if (!file.mimetype.includes(fileType)) {
    return validateMessage[FILE_TYPE_ERROR]
  }
  if (file.size > fileSize) {
    return validateMessage[FILE_SIZE_ERROR]
  }
  return validateMessage[SUCCESS]
}

module.exports = validateFile
