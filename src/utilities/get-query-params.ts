export class ParamsUtilities {
  public static getQueryParams = (url = window.location.href) => {
    const params = new URL(url).searchParams;
    return Object.fromEntries(params.entries());
  };

  public static setQueryParams = (key: string, value: string) => {
    const urlObj = new URL(window.location.href);
    urlObj.searchParams.set(key, value);
    window.history.pushState({}, '', urlObj.toString());
    return urlObj.toString();
  };
}

export const getQueryParams = ParamsUtilities.getQueryParams;
