import { Observable } from "rxjs/Observable";

export const createPipe = (source, ...pipes) =>
  new Observable(observer =>
    source.pipe(...pipes).subscribe({
      next(event) {
        observer.next(event);
      },
      error(err) {
        observer.error(err);
      },
      complete() {
        observer.complete();
      }
    })
  );

export default createPipe;
