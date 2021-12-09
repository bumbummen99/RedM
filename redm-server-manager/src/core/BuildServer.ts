import { JSDOM } from 'jsdom'
import fetch, { Response } from 'node-fetch'

export type BuildInformation = {
    build: string,
    commit: string,
}

export default class BuildServer {

    _behaivour: string

    _buildServerURL: string

    /**
     * @param {string} behaivour Determines what build type information to extract. Valid values are 'recommended', 'optional' or undefined for latest
     * @param {string} url Determines the build server address to fetch. Use your own or set undefined for default http://runtime.fivem.net/artifacts/fivem/build_proot_linux/master
     */
    constructor(behaivour: string = 'latest', url: string = 'http://runtime.fivem.net/artifacts/fivem/build_proot_linux/master') {
        this._behaivour = behaivour 
        this._buildServerURL = url
    }

    /**
     * Fetches the build page and extracts the desired build number and commit ref
     * 
     * @returns {Object}
     */
    async fetchData() : Promise<BuildInformation> {
        /* Fetch the Build-Server Page */
        const response: Response = await fetch(this._buildServerURL)

        /* Check if the request was successfull */
        if (response.ok) {
            /* Getch the content of the response */
            const html: string = await response.text()

            /* Parse the received HTML */
            const dom: JSDOM = new JSDOM(html);

            /* Initialize an empty anchor to write to */
            let anchor: Element|null = null

            /* Select desired anchor based on the given behaivour */
            switch (this._behaivour) {
                case 'recommended':
                    /* Get the recommended build element */
                    anchor = dom.window.document.querySelector(`a.button.is-link.is-primary`)
                case 'optional':
                    /* Get the optional build element */
                    anchor = dom.window.document.querySelector(`a.button.is-link.is-danger`)
                default:
                    /* Get the latest build element */
                    anchor = dom.window.document.querySelector(`a.panel-block:not([href='..'])`)
            }
            
            /* Check if we found any anchor */
            if (anchor) {
                /* Copy the href of the element */
                const href: string|null = anchor.getAttribute('href')

                if (href) {
                    /* Extract the build string from the href */
                    const buildString: string = href.split('/')[1]

                    /* Remove extension and get build and commit ref */
                    const [build, commit]: string[] = buildString.replace(/\.[^/.]+$/, "").split('-')

                    return {
                        build: build,
                        commit: commit
                    }
                } else {
                    throw new Error('Found build does not have a href attribute.')
                }
            } else {
                throw new Error('Could not find any build anchor to extract.')
            }
        } else {
            throw new Error(`Could not fetch Build-Server, Status: ${response.status}`)
        }
    }
}
