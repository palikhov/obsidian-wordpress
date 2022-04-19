import { App, PluginSettingTab, Setting } from 'obsidian';
import WordpressPlugin from './main';
import { PostStatus } from './wp-api';
import { OAuth2Client } from './oauth2';

export const enum ApiType {
  XML_RPC = 'xml-rpc',
  RestAPI_miniOrange = 'miniOrange',
  Jetpack = 'jetpack'
}

export interface WordpressPluginSettings {

  /**
   * API type.
   */
  apiType: ApiType;

  /**
   * Endpoint.
   */
  endpoint: string;

  /**
   * WordPress user name.
   */
  userName?: string;

  /**
   * Save user name to local data.
   */
  saveUserName: boolean;

  /**
   * Show plugin icon in side.
   */
  showRibbonIcon: boolean;

  /**
   * Default post status.
   */
  defaultPostStatus: PostStatus;

  /**
   * Authenticated token by OAuth2.
   */
  oauth2Token: string | null;
}

export const DEFAULT_SETTINGS: WordpressPluginSettings = {
  apiType: ApiType.XML_RPC,
  endpoint: '',
  saveUserName: false,
  showRibbonIcon: false,
  defaultPostStatus: PostStatus.Draft,
  oauth2Token: null
}

export class WordpressSettingTab extends PluginSettingTab {

	constructor(
    app: App,
    private readonly plugin: WordpressPlugin
  ) {
		super(app, plugin);
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

    containerEl.createEl('h2', { text: 'Settings for WordPress plugin' });

		new Setting(containerEl)
			.setName('WordPress URL')
			.setDesc('Full path of installed WordPress, for example, https://example.com/wordpress')
			.addText(text => text
				.setPlaceholder('https://example.com/wordpress')
				.setValue(this.plugin.settings.endpoint)
				.onChange(async (value) => {
          this.plugin.settings.endpoint = value;
          await this.plugin.saveSettings();
        }));
    new Setting(containerEl)
      .setName('API Type')
      .setDesc('Select which API you want to use.')
      .addDropdown((dropdown) => {
        dropdown
          .addOption(ApiType.XML_RPC, 'XML-RPC')
          .addOption(ApiType.RestAPI_miniOrange, 'REST API Authentication by miniOrange')
          .addOption(ApiType.Jetpack, 'Jetpack')
          .setValue(this.plugin.settings.apiType)
          .onChange(async (value: ApiType) => {
            this.plugin.settings.apiType = value;
            await this.plugin.saveSettings();
            this.display();
          });
      });
    if (this.plugin.settings.apiType === ApiType.Jetpack) {
      if (this.plugin.settings.oauth2Token) {
        new Setting(containerEl)
          .setName('Jetpack Logout')
          .setDesc('You are now login WordPress, click right button to logout.')
          .addButton((button) => {
            button.setButtonText('Logout')
              .setCta()
              .onClick(() => {
                this.plugin.settings.oauth2Token = null;
                this.display();
              });
          });
      } else {
        new Setting(containerEl)
          .setName('Jetpack Authentication')
          .setDesc('Click right button to authenticate WordPress by Jetpack plugin.')
          .addButton((button) => {
            button.setButtonText('Authenticate')
              .setCta()
              .onClick(() => {
                const oauth2 = new OAuth2Client(this.plugin);
                oauth2.authorize();
              });
          });
      }
    }
    new Setting(containerEl)
      .setName('Show icon in sidebar')
      .setDesc(`If enabled, a button which opens publish panel will be added to the Obsidian sidebar.
Changes only take effect on reload.`)
      .addToggle((toggle) =>
        toggle
          .setValue(this.plugin.settings.showRibbonIcon)
          .onChange(async (value) => {
            this.plugin.settings.showRibbonIcon = value;
            await this.plugin.saveSettings();
            this.display();

            this.plugin.updateRibbonIcon();
          }),
      );

    new Setting(containerEl)
      .setName('Default Post Status')
      .setDesc('Post status which will be published to WordPress.')
      .addDropdown((dropdown) => {
        dropdown
          .addOption(PostStatus.Draft, 'draft')
          .addOption(PostStatus.Publish, 'publish')
          // .addOption(PostStatus.Future, 'future')
          .setValue(this.plugin.settings.defaultPostStatus)
          .onChange(async (value: PostStatus) => {
            this.plugin.settings.defaultPostStatus = value;
            await this.plugin.saveSettings();
            this.display();
          });
      });
	}
}
