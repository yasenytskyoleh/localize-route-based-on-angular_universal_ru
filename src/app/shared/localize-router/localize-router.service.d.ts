import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { LocalizeParser } from './localize-router.parser';
import { LocalizeRouterSettings } from './localize-router.config';
/**
 * Localization service
 * modifyRoutes
 */
export declare class LocalizeRouterService {
    parser: LocalizeParser;
    settings: LocalizeRouterSettings;
    private router;
    routerEvents: Subject<string>;
    /**
     * CTOR
     * @param parser
     * @param settings
     * @param router
     */
    constructor(parser: LocalizeParser, settings: LocalizeRouterSettings, router: Router);
    /**
     * Start up the service
     */
    init(): void;
    /**
     * Change language and navigate to translated route
     * @param lang
     */
    changeLanguage(lang: string): void;
    /**
     * Traverses through the tree to assemble new translated url
     * @param snapshot
     * @param isRoot
     * @returns {string}
     */
    private traverseSnapshot(snapshot, isRoot?);
    /**
     * Extracts new segment value based on routeConfig and url
     * @param snapshot
     * @returns {string}
     */
    private parseSegmentValue(snapshot);
    /**
     * Translate route to current language
     * If new language is explicitly provided then replace language part in url with new language
     * @param path
     * @returns {string | any[]}
     */
    translateRoute(path: string | any[]): string | any[];
    /**
     * Event handler to react on route change
     * @returns {(event:any)=>void}
     * @private
     */
    private _routeChanged();
}
