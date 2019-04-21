import { ModuleWithProviders, Injector } from '@angular/core';
import { LocalizeParser } from './localize-router.parser';
import { Routes } from '@angular/router';
import { LocalizeRouterConfig } from './localize-router.config';
export declare class ParserInitializer {
    private injector;
    parser: LocalizeParser;
    routes: Routes;
    /**
     * CTOR
     * @param injector
     */
    constructor(injector: Injector);
    /**
     * @returns {Promise<any>}
     */
    appInitializer(): Promise<any>;
    /**
     * @param parser
     * @param routes
     * @returns {()=>Promise<any>}
     */
    generateInitializer(parser: LocalizeParser, routes: Routes[]): () => Promise<any>;
}
/**
 * @param p
 * @param parser
 * @param routes
 * @returns {any}
 */
export declare function getAppInitializer(p: ParserInitializer, parser: LocalizeParser, routes: Routes[]): any;
export declare class LocalizeRouterModule {
    static forRoot(routes: Routes, config?: LocalizeRouterConfig): ModuleWithProviders;
    static forChild(routes: Routes): ModuleWithProviders;
}
/**
 * @param localizeRouterModule
 * @returns {string}
 */
export declare function provideForRootGuard(localizeRouterModule: LocalizeRouterModule): string;
