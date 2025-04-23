export class ParamsUtilities {
  public static getQueryParams = (url = window.location.href) => {
    const params = new URL(url).searchParams;
    return Object.fromEntries(params.entries());
  };
}

export const getQueryParams = ParamsUtilities.getQueryParams;
