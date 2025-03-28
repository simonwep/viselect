import VanillaSelectionArea from '@viselect/vanilla';
import {SelectionEvents, PartialSelectionOptions} from '@viselect/vanilla';
import {createContext, createRef, FunctionalComponent, JSX} from 'preact';
import {useEffect, useContext, useState} from 'preact/hooks';

export interface SelectionAreaProps extends PartialSelectionOptions, JSX.HTMLAttributes<HTMLDivElement> {
    id?: string;
    className?: string;
    onBeforeStart?: SelectionEvents['beforestart'];
    onBeforeDrag?: SelectionEvents['beforedrag'];
    onStart?: SelectionEvents['start'];
    onMove?: SelectionEvents['move'];
    onStop?: SelectionEvents['stop'];
}

const SelectionContext = createContext<VanillaSelectionArea | undefined>(undefined);

export const useSelection = () => useContext(SelectionContext);

export const SelectionArea: FunctionalComponent<SelectionAreaProps> = props => {
    const [instance, setInstance] = useState<VanillaSelectionArea | undefined>(undefined);
    const root = createRef<HTMLDivElement>();

    useEffect(() => {
        /* eslint-disable @typescript-eslint/no-unused-vars */
        const {boundaries = root.current, onBeforeStart, onBeforeDrag, onStart, onMove, onStop, ...opt} = props;

        const selection = new VanillaSelectionArea({
            boundaries: boundaries as HTMLElement,
            ...opt
        });

        selection.on('beforestart', evt => props.onBeforeStart?.(evt));
        selection.on('beforedrag', evt => props.onBeforeDrag?.(evt));
        selection.on('start', evt => props.onStart?.(evt));
        selection.on('move', evt => props.onMove?.(evt));
        selection.on('stop', evt => props.onStop?.(evt));

        setInstance(selection);

        return () => {
            selection.destroy();
            setInstance(undefined);
        };
    }, []);

    return (
        <SelectionContext.Provider value={instance}>
            {props.boundaries ? (
                props.children
            ) : (
                <div ref={root} className={props.className} id={props.id}>
                    {props.children}
                </div>
            )}
        </SelectionContext.Provider>
    );
};
