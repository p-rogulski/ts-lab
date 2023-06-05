const someInjectedData: { name: string } = { name: "Injected data" };

enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

interface Endpoint {
  type: string;
  uri: string;
}

type Constructor = {
  new (...args: any[]): {};
};

function controller(uri: string) {
  return function <T extends Constructor>(constructor: T): T | void {
    return class extends constructor {
      constructor(...args: any[]) {
        super(...args, someInjectedData);
        this.setMetadata();
      }

      private setMetadata(): void {
        const prototype = constructor.prototype;
        const metadata: Map<string, Endpoint> = prototype["__metadata__"];

        if (metadata) {
          metadata.forEach((value) => {
            value.uri = `/${uri}${value.uri}`;
          });
        }
      }
    };
  };
}

function get(uri: string) {
  return function (target: any, key: string) {
    getMatadata(target).set(key, { method: HttpMethod.GET, uri });
  };
}

function post(uri: string) {
  return function (target: any, key: any) {
    getMatadata(target).set(key, { method: HttpMethod.POST, uri });
  };
}

function put(uri: string) {
  return function (target: any, key: any) {
    getMatadata(target).set(key, { method: HttpMethod.PUT, uri });
  };
}

function del(uri: string) {
  return function (target: any, key: any) {
    getMatadata(target).set(key, { method: HttpMethod.DELETE, uri });
  };
}

function getMatadata(target: any) {
  target["__metadata__"] = target["__metadata__"] || new Map();
  return target["__metadata__"];
}

//PoC class
@controller("user")
class UserController {
  constructor(someInjectedData: { name: string });
  
  @post("/add")
  public addUser(req: any, resp: any): void {
    // ...
  }

  @get("/list")
  public getUsers(req: any, resp: any): void {
    // ...
  }

  // Others REST...
}
