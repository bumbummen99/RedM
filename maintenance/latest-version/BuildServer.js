import { JSDOM } from 'jsdom'
import fetch from 'node-fetch'

export default class BuildServer {
    /**
     * @param {string} behaivour Determines what build type information to extract. Valid values are 'recommended', 'optional' or falsy for latest
     * @param {string} url Determines the build server address to fetch. Use your own or set falsy for default http://runtime.fivem.net/artifacts/fivem/build_proot_linux/master
     */
    constructor(behaivour = null, url = 'http://runtime.fivem.net/artifacts/fivem/build_proot_linux/master') {
        this._behaivour = behaivour 
        this._buildServerURL = url
    }

    /**
     * Fetches the build page and extracts the desired build number and commit ref
     * 
     * @returns {Object}
     */
    async fetchData() {
        /* Fetch the Build-Server Page */
        const response = await fetch(this._buildServerURL)

        /* Check if the request was successfull */
        if (response.ok) {
            /* Getch the content of the response */
            const html = await response.text()

            /* Parse the received HTML */
            const dom = new JSDOM(html);

            /* Initialize an empty anchor to write to */
            let anchor = null

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
                const href = anchor.href

                /* Extract the build string from the href */
                const buildString = href.split('/')[1]

                /* Remove extension and get build and commit ref */
                const [build, commit] = buildString.replace(/\.[^/.]+$/, "").split('-')

                return {
                    build: build,
                    commit: commit
                }
            } else {
                throw new Error('Could not find any build anchor to extract.')
            }
        } else {
            throw new Error(`Could not fetch Build-Server, Status: ${response.status}`)
        }
    }
}
