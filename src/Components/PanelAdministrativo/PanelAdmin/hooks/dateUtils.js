export const extractYearMonth = (dateString) => {
  if (!dateString) return null;
  
  // Si es fecha ISO (2026-03-02T11:37:09.000Z)
  if (dateString.includes('T')) {
    return dateString.split('T')[0].substring(0, 7);
  }
  
  // Si es formato YYYY-MM-DD
  if (dateString.includes('-') && dateString.length >= 10) {
    return dateString.substring(0, 7);
  }
  
  // Si solo es YYYY-MM
  if (dateString.length === 7 && dateString.includes('-')) {
    return dateString;
  }
  
  // Si es timestamp numérico o Date object
  try {
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      return `${year}-${month}`;
    }
  } catch (e) {
    // Ignorar error
  }
  
  return null;
};

export const filterItemsByMonth = (items, month, dateField) => {
  if (!items || !month || !Array.isArray(items)) return [];
  
  return items.filter(item => {
    const itemDate = item[dateField];
    if (!itemDate) return false;
    
    const itemMonth = extractYearMonth(itemDate);
    return itemMonth === month;
  });
};

// Nueva función útil para comparar fechas
export const isDateBeforeOrEqual = (dateString, targetMonth) => {
  if (!dateString || !targetMonth) return false;
  
  const dateMonth = extractYearMonth(dateString);
  if (!dateMonth) return false;
  
  return dateMonth <= targetMonth;
};