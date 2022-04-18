import { Editor, MarkdownView, Notice, Plugin } from 'obsidian';
import { DEFAULT_SETTINGS, WordpressPluginSettings, WordPressPluginSharedData, WordpressSettingTab } from './settings';
import { addIcons } from './icons';
import { WordPressPostParams } from './wp-client';
import { getWordPressClient } from './wp-clients';

export default class WordpressPlugin extends Plugin {

  /**
   * Settings that will be persist saved.
   */
	settings: WordpressPluginSettings;

  /**
   * Shared data.
   */
  data: WordPressPluginSharedData;

	async onload() {
    console.log('loading obsidian-wordpress plugin');

		await this.loadSettings();

    addIcons();

    this.updateRibbonIcon();

    this.addCommand({
      id: 'defaultPublish',
      name: 'Publish current document with default options',
      editorCallback: (editor: Editor, view: MarkdownView) => {
        const params: WordPressPostParams = {
          status: this.settings.defaultPostStatus
        };
        this.publishPost(params);
      }
    });

    this.addCommand({
      id: 'publish',
      name: 'Publish current document',
      editorCallback: (editor: Editor, view: MarkdownView) => {
        this.publishPost();
      }
    });

    const settingTab = new WordpressSettingTab(this.app, this);
		this.addSettingTab(settingTab);

    this.registerObsidianProtocolHandler('wordpress-plugin', async (e) => {
      if (e.action === 'wordpress-plugin') {
        if (e.state) {
          if (e.error) {
            new Notice(`WordPress authorize failed!\n${e.error}: ${e.error_description.replace(/\+/g,' ')}`);
          } else if (e.code) {
            this.data.oauth2Code = e.code;
            new Notice('WordPress authorize successfully.');
            // call display() to show logout button
            settingTab.display();
          }
        }
      }
    });
	}

	onunload() {
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

  updateRibbonIcon(): void {
    const ribbonIconTitle = 'WordPress Publish';
    if (this.settings.showRibbonIcon) {
      this.addRibbonIcon('wp-logo', ribbonIconTitle, () => {
        this.publishPost();
      });
    } else {
      const leftRibbon: any = this.app.workspace.leftRibbon; // eslint-disable-line
      const children = leftRibbon.ribbonActionsEl.children;
      for (let i = 0; i < children.length; i++) {
        if (children.item(i).getAttribute('aria-label') === ribbonIconTitle) {
          (children.item(i) as HTMLElement).style.display = 'none';
        }
      }
    }
  }

  private publishPost(defaultPostParams?: WordPressPostParams): void {
    const client = getWordPressClient(this.app, this);
    if (client) {
      client.newPost(defaultPostParams).then();
    }
  }

}
