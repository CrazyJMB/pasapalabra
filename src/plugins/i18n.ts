import { createI18n } from "vue-i18n";
import messages from "@intlify/unplugin-vue-i18n/messages";

const i18n = createI18n({
  locale: "es-ES",
  fallbackLocale: "en-US",
  messages,
  legacy: false,
  globalInjection: true,
  warnHtmlInMessage: "off",
});

export default i18n;
