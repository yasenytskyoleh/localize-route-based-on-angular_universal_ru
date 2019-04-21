import { Injectable, Inject, PLATFORM_ID } from "@angular/core";
import { REQUEST } from "@nguniversal/express-engine/tokens";
import { UniversalStorage } from "../storage/universal.storage";
import { isPlatformBrowser, isPlatformServer, DOCUMENT } from "@angular/common";
import { TranslateService } from "@ngx-translate/core";
import { LOCALIZE_CACHE_NAME } from "./localize-router.config";
import { MetaService } from "@ngx-meta/core";

@Injectable()
export class LocalizeLanguageService {
    constructor(
        @Inject(PLATFORM_ID) private _platformId: Object,
        @Inject(DOCUMENT) private _document: any,
        @Inject(REQUEST) private _request: any,
        @Inject(REQUEST) private _req: any,
        @Inject(UniversalStorage) private _appStorage: Storage,
        @Inject(TranslateService) private translate: TranslateService,
        @Inject(MetaService) private _meta: MetaService,
    ) { }
    public initLanguage(): Promise<any> {
        return new Promise((resolve: Function) => {
            this.translate.addLangs(['en', 'ru'].map((lang) => lang));
            const language: string = this._getLanguage();
            if (language) {
                this.translate.setDefaultLang(language);
            } else {
                this.translate.setDefaultLang('en');
            }
            this._setLanguage(language);
            resolve();
        });
    }
    public _getLanguage() {
        // fix init cookie
        this._req.cookie = this._req.headers['cookie'];
        let language: string = this._getFindLang(this._appStorage.getItem(LOCALIZE_CACHE_NAME));
        if (language) {
            return language;
        }
        if (isPlatformBrowser(this._platformId)) {
            language = this._getFindLang(this.translate.getBrowserLang());
        }
        if (isPlatformServer(this._platformId)) {
            try {
                const reqLangList: string[] = this._request.headers['accept-language']
                    .split(';')[0]
                    .split(',');
                language = ['en', 'ru'].find(
                    (lang: string) =>
                        reqLangList.indexOf(lang) !== -1 || reqLangList.indexOf(lang) !== -1,
                );
            } catch (err) {
                language = 'en';
            }
        }
        language = language || 'en';
        // this._appStorage.setItem(LOCALIZE_CACHE_NAME, language);
        return language;
    }
    public _getFindLang(code: string): string | null {
        return code ? ['en', 'ru'].find((lang: string) => lang === code) : null;
    }

    public changeLang(code: string): void {
        const lang: string = this._getFindLang(code);
        if (!lang || lang === this.translate.currentLang) {
            return;
        }
        this._appStorage.setItem(LOCALIZE_CACHE_NAME, lang);
        this._setLanguage(lang);
    }

    public _setLanguage(lang: string): void {
        this.translate.use(lang).subscribe(() => {
            this._meta.setTag('og:locale', lang);
            this._document.documentElement.lang = lang;
        });
    }

}