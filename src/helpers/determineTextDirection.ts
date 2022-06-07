const determineTextDirection = (language: string): 'ltr' | 'rtl' => {
  if (language === 'hbo') {
    return 'rtl';
  }

  return 'ltr';
};

export default determineTextDirection;
