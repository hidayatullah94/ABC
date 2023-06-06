const name = async (req = request, res = response) => {
  try {
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};

const get = async (req = request, res = response) => {
  try {
  } catch (error) {
    res.status(500).json({
      succes: false,
      error: error.message,
    });
  }
};
