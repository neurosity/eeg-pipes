
import { Observable } from 'rxjs/Observable';

export const createPipe = (source, ...pipes) =>
    new Observable(observer => {
        return source.pipe(...pipes).subscribe({
            next (x) {
                observer.next(x);
            },
            error (err) { observer.error(err); },
            complete () { observer.complete(); }
        })
    });

export default createPipe;
