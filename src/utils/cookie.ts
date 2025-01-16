// Функция для получения значения cookie по имени
export function getCookie(name: string): string | undefined {
  // Ищем cookie, соответствующее переданному имени
  const matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        // Экранируем специальные символы в имени cookie для использования в регулярных выражениях
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)'  // Ищем значение cookie, которое идет после '='
    )
  );
  
  // Если cookie найдена, декодируем её значение и возвращаем, иначе возвращаем undefined
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

// Функция для установки значения cookie
export function setCookie(
  name: string,
  value: string,
  props: { [key: string]: string | number | Date | boolean } = {}
) {
  // Устанавливаем стандартное значение для пути, если оно не передано
  props = {
    path: '/',
    ...props
  };

  let exp = props.expires;
  
  // Если срок действия cookie задан числом (в секундах), вычисляем дату окончания
  if (exp && typeof exp === 'number') {
    const d = new Date();
    d.setTime(d.getTime() + exp * 1000);  // Устанавливаем время окончания cookie
    exp = props.expires = d;  // Преобразуем его в объект Date
  }

  // Если срок действия cookie является объектом Date, преобразуем его в строку UTC
  if (exp && exp instanceof Date) {
    props.expires = exp.toUTCString();
  }
  
  // Кодируем значение cookie для корректной передачи в браузере
  value = encodeURIComponent(value);
  
  // Начинаем формировать строку для установки cookie
  let updatedCookie = name + '=' + value;
  
  // Добавляем остальные параметры (например, expires, path и другие)
  for (const propName in props) {
    updatedCookie += '; ' + propName;
    const propValue = props[propName];
    
    // Если значение параметра не true, добавляем его после '='
    if (propValue !== true) {
      updatedCookie += '=' + propValue;
    }
  }

  // Устанавливаем cookie в браузер
  document.cookie = updatedCookie;
}

// Функция для удаления cookie по имени
export function deleteCookie(name: string) {
  // Устанавливаем cookie с истекшим сроком действия, чтобы удалить её
  setCookie(name, '', { expires: -1 });
}
