export const handleResponse = (response) => {
  if (response.ok) {
    return response.json();
  }
  return Promise.reject(response)
};

export function emojiUnicode (emoji) {
    var comp;
    if (emoji.length === 1) {
        comp = emoji.charCodeAt(0);
    }
    comp = (
        (emoji.charCodeAt(0) - 0xD800) * 0x400
      + (emoji.charCodeAt(1) - 0xDC00) + 0x10000
    );
    if (comp < 0) {
        comp = emoji.charCodeAt(0);
    }
    return comp.toString("16");
};

export const generateQueryString = (query) => {
  let query_string = '?';
  Object.keys(query).map(query_key => {
    let string_term = query_key + '=' + query[query_key] + '&';
    query_string = query_string.concat(string_term)
  });

  return query_string.slice(0, -1);
};
