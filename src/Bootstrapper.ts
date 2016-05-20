import {IBootstrapper}            from "./interfaces/IBootstrapper";
import {IContainer}               from './interfaces/IContainer';
import {DOMUtils}                 from './utils/DOMUtils';
import {ReactFactory}             from './factories/ReactFactory';

export class Bootstrapper implements IBootstrapper {

    // Note for es5 support we cannot have the private accessor here
    _componentSelector: string;

    _container: IContainer;

    firstClassElements: NodeListOf<Element>;

    
    /**
     * Constructor
     */
    constructor() {
        // Sanity check
        if (!window || (!window && !window.document)) {
            throw new Error('ReactBootstrapper requires a DOM but cannot see one :(');
        }

        this._componentSelector = 'data-component';

        this.firstClassElements = window.document.querySelectorAll(`[${this.componentSelector}]`);
    }

    /**
     * Get's the component selector, this is used
     * @returns {string}
     */
    get componentSelector():string {
        return this._componentSelector;
    }

    /**
     * Set the react container
     * @param {IContainer} container - The container
     */
    setContainer(container: IContainer): void {
        this._container = container;
        this._wireUpReactComponents();
    }

    /**
     * Wires up components inside the container
     * @private
     */
    _wireUpReactComponents():void {

        // Iterate over component elements in the dom
        for (var i = 0; i < this.firstClassElements.length; ++i) {

            var ele = this.firstClassElements[i],

                componentName = ele.getAttribute(this._componentSelector),
                
                component = this._container.getComponent(componentName);

            if (!component) {
                console.warn(`Cannot resolve component "${componentName}". Did you forget to register it in the container?`);
                continue;
            }

            var props = DOMUtils.parseProps(ele) || {};
            var portal = DOMUtils.openPortal(ele);

            debugger;

            ReactFactory.inject(component, props, portal);
        }

    }

}


