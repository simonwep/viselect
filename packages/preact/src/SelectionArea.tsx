import VanillaSelectionArea from '@viselect/vanilla';
import {SelectionEvents, PartialSelectionOptions} from '@viselect/vanilla';
import {createContext, JSX, FunctionalComponent} from 'preact';
import {useEffect, useContext, useState, useMemo, useRef} from 'preact/hooks';

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
    const {
        boundaries,
        document: doc,
        selectables,
        startAreas,
        container,
        behaviour,
        features,
        onBeforeStart,
        onBeforeDrag,
        onStart,
        onMove,
        onStop,
        className,
        id,
        children,
        ...rest
    } = props;

    const [instance, setInstance] = useState<VanillaSelectionArea | undefined>(undefined);
    const root = useRef<HTMLDivElement>(null);

    // Use refs for callbacks to avoid recreating the instance when only callbacks change
    const callbacksRef = useRef({onBeforeStart, onBeforeDrag, onStart, onMove, onStop});
    callbacksRef.current = {onBeforeStart, onBeforeDrag, onStart, onMove, onStop};

    // Stable serialization of object props for dependency comparison
    const behaviourKey = useMemo(() => JSON.stringify(behaviour), [behaviour]);
    const featuresKey = useMemo(() => JSON.stringify(features), [features]);

    useEffect(() => {
        const boundaryElement = boundaries ?? root.current;

        const selection = new VanillaSelectionArea({
            boundaries: boundaryElement as HTMLElement,
            document: doc,
            selectables,
            startAreas,
            container,
            behaviour,
            features
        });

        selection.on('beforestart', evt => callbacksRef.current.onBeforeStart?.(evt));
        selection.on('beforedrag', evt => callbacksRef.current.onBeforeDrag?.(evt));
        selection.on('start', evt => callbacksRef.current.onStart?.(evt));
        selection.on('move', evt => callbacksRef.current.onMove?.(evt));
        selection.on('stop', evt => callbacksRef.current.onStop?.(evt));

        setInstance(selection);

        return () => {
            selection.destroy();
            setInstance(undefined);
        };
    }, [boundaries, doc, selectables, startAreas, container, behaviourKey, featuresKey]);

    return (
        <SelectionContext.Provider value={instance}>
            {boundaries ? (
                children
            ) : (
                <div ref={root} className={className} id={id} {...rest}>
                    {children}
                </div>
            )}
        </SelectionContext.Provider>
    );
};
