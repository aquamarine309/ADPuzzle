import EternityChallengeStartModal from "../components/modals/challenges/EternityChallengeStartModal.js";
import InfinityChallengeStartModal from "../components/modals/challenges/InfinityChallengeStartModal.js";
import MessageModal from "../components/modals/MessageModal.js";
import NormalChallengeStartModal from "../components/modals/challenges/NormalChallengeStartModal.js";

import AntimatterGalaxyModal from "../components/modals/prestige/AntimatterGalaxyModal.js";
import ArmageddonModal from "../components/modals/prestige/ArmageddonModal.js";
import BigCrunchModal from "../components/modals/prestige/BigCrunchModal.js";
import DimensionBoostModal from "../components/modals/prestige/DimensionBoostModal.js";
import EnterCelestialsModal from "../components/modals/prestige/EnterCelestialsModal.js";
import EnterDilationModal from "../components/modals/prestige/EnterDilationModal.js";
import EternityModal from "../components/modals/prestige/EternityModal.js";
import ExitChallengeModal from "../components/modals/prestige/ExitChallengeModal.js";
import ExitDilationModal from "../components/modals/prestige/ExitDilationModal.js";
import HardResetModal from "../components/modals/prestige/HardResetModal.js";
import RealityModal from "../components/modals/prestige/RealityModal.js";
import ReplicantiGalaxyModal from "../components/modals/prestige/ReplicantiGalaxyModal.js";
import ResetRealityModal from "../components/modals/prestige/ResetRealityModal.js";

import AnimationOptionsModal from "../components/modals/options/AnimationOptionsModal.js";
import AwayProgressOptionsModal from "../components/modals/options/AwayProgressOptionsModal.js";
import BackupWindowModal from "../components/modals/options/BackupWindowModal.js";
 import ConfirmationOptionsModal from "../components/modals/options/ConfirmationOptionsModal.js";
import CosmeticSetChoiceModal from "../components/modals/options/glyph-appearance/CosmeticSetChoiceModal.js";
import GlyphDisplayOptionsModal from "../components/modals/options/glyph-appearance/GlyphDisplayOptionsModal.js";
import HiddenTabsModal from "../components/modals/options/hidden-tabs/HiddenTabsModal.js";
import HotkeysModal from "../components/modals/options/HotkeysModal.js";
import InfoDisplayOptionsModal from "../components/modals/options/InfoDisplayOptionsModal.js";
import NewsOptionsModal from "../components/modals/options/NewsOptionsModal.js";
import NotationModal from "../components/modals/options/NotationModal.js";
import PreferredTreeModal from "../components/modals/options/PreferredTreeModal.js";
import SingleGlyphAppearanceModal from "../components/modals/options/glyph-appearance/SingleGlyphAppearanceModal.js";

import DeleteCompanionGlyphModal from "../components/modals/glyph-management/DeleteCompanionGlyphModal.js";
import DeleteGlyphModal from "../components/modals/glyph-management/DeleteGlyphModal.js";
import PurgeAllRejectedGlyphsModal from "../components/modals/glyph-management/PurgeAllRejectedGlyphsModal.js";
import PurgeAllUnprotectedGlyphsModal from "../components/modals/glyph-management/PurgeAllUnprotectedGlyphsModal.js";
import PurgeGlyphModal from "../components/modals/glyph-management/PurgeGlyphModal.js";
import RefineGlyphModal from "../components/modals/glyph-management/RefineGlyphModal.js";
import SacrificeGlyphModal from "../components/modals/glyph-management/SacrificeGlyphModal.js";

import AutobuyerEditModal from "../components/modals/AutobuyerEditModal.js";
import AutomatorScriptTemplate from "../components/modals/AutomatorScriptTemplate.js";
import AwayProgressModal from "../components/modals/AwayProgressModal.js";
import BreakInfinityModal from "../components/modals/BreakInfinityModal.js";
import ChangelogModal from "../components/modals/ChangelogModal.js";
import ChangeNameModal from "../components/modals/ChangeNameModal.js";
import ClearConstantsModal from "../components/modals/ClearConstantsModal.js";
import CreditsModal from "../components/modals/CreditsModal.js";
import DeleteAutomatorScriptModal from "../components/modals/DeleteAutomatorScriptModal.js";
import EnslavedHintsModal from "../components/modals/EnslavedHintsModal.js";
import GlyphSetSaveDeleteModal from "../components/modals/GlyphSetSaveDeleteModal.js";
import GlyphShowcasePanelModal from "../components/modals/GlyphShowcasePanelModal.js";
import H2PModal from "../components/modals/H2PModal.js";
import ImportAutomatorDataModal from "../components/modals/ImportAutomatorDataModal.js";
import ImportFilterModal from "../components/modals/ImportFilterModal.js";
import ImportSaveModal from "../components/modals/ImportSaveModal.js";
import ImportTimeStudyConstants from "../components/modals/ImportTimeStudyConstants.js";
import InformationModal from "../components/modals/InformationModal.js";
import LoadGameModal from "../components/modals/LoadGameModal.js";
import ModifySeedModal from "../components/modals/ModifySeedModal.js";
import PelleEffectsModal from "../components/modals/PelleEffectsModal.js";
import RealityGlyphCreationModal from "../components/modals/RealityGlyphCreationModal.js";
import ReplaceGlyphModal from "../components/modals/ReplaceGlyphModal.js";
import RespecIAPModal from "../components/modals/RespecIAPModal.js";
import SacrificeModal from "../components/modals/SacrificeModal.js";
import SingularityMilestonesModal from "../components/modals/SingularityMilestonesModal.js";
import SpeedrunModeModal from "../components/modals/SpeedrunModeModal.js";
import StdStoreModal from "../components/modals/StdStoreModal.js";
import StudyStringModal from "../components/modals/StudyStringModal.js";
import SwitchAutomatorEditorModal from "../components/modals/SwitchAutomatorEditorModal.js";
import UiChoiceModal from "../components/modals/UiChoiceModal.js";
import UndoGlyphModal from "../components/modals/UndoGlyphModal.js";
import UpgradeMechanicLockModal from "../components/modals/UpgradeMechanicLockModal.js";
import LC3HelpModal from "../components/modals/LC3HelpModal.js";

import S12GamesModal from "../components/modals/secret-themes/S12GamesModal.js";

let nextModalID = 0;
export class Modal {
  constructor(component, priority = 0, closeEvent) {
    this._component = component;
    this._modalConfig = {};
    this._priority = priority;
    this._closeEvent = closeEvent;
  }

  // We can't handle this in the Vue components because if the modal order changes, all the event listeners from the
  // top modal end up getting removed from the EventHub due to the component being temporarily destroyed. This could
  // result in the component sticking around because an event it was listening for happened while it wasn't on top.
  applyCloseListeners(closeEvent) {
    // Most of the time the close event will be a prestige event, in which case we want it to trigger on all higher
    // prestiges as well
    const prestigeOrder = [GAME_EVENT.DIMBOOST_AFTER, GAME_EVENT.GALAXY_RESET_AFTER, GAME_EVENT.BIG_CRUNCH_AFTER,
      GAME_EVENT.ETERNITY_RESET_AFTER, GAME_EVENT.REALITY_RESET_AFTER];
    let shouldClose = false;
    for (const prestige of prestigeOrder) {
      if (prestige === closeEvent) shouldClose = true;
      if (shouldClose) EventHub.ui.on(prestige, () => this.removeFromQueue(), this._component);
    }

    // In a few cases we want to trigger a close based on a non-prestige event, so if the specified event wasn't in
    // the prestige array above, we just add it on its own
    if (!shouldClose) EventHub.ui.on(closeEvent, () => this.removeFromQueue(), this._component);
  }

  show(modalConfig) {
    if (!GameUI.initialized) return;
    this._uniqueID = nextModalID++;
    this._props = Object.assign({}, modalConfig || {});
    if (this._closeEvent) this.applyCloseListeners(this._closeEvent);
    if (modalConfig?.closeEvent) this.applyCloseListeners(modalConfig.closeEvent);

    const modalQueue = ui.view.modal.queue;
    // Add this modal to the front of the queue and sort based on priority to ensure priority is maintained.
    modalQueue.unshift(this);
    Modal.sortModalQueue();
  }

  get isOpen() {
    return ui.view.modal.current === this;
  }

  get component() {
    return this._component;
  }

  get props() {
    return this._props;
  }

  get priority() {
    return this._priority;
  }

  removeFromQueue() {
    EventHub.ui.offAll(this._component);
    ui.view.modal.queue = ui.view.modal.queue.filter(m => m._uniqueID !== this._uniqueID);
    if (ui.view.modal.queue.length === 0) ui.view.modal.current = undefined;
    else ui.view.modal.current = ui.view.modal.queue[0];
  }

  static sortModalQueue() {
    const modalQueue = ui.view.modal.queue;
    modalQueue.sort((x, y) => y.priority - x.priority);
    // Filter out multiple instances of the same modal.
    const singleQueue = [...new Set(modalQueue)];
    ui.view.modal.queue = singleQueue;
    ui.view.modal.current = singleQueue[0];
  }

  static hide() {
    if (!GameUI.initialized) return;
    ui.view.modal.queue.shift();
    if (ui.view.modal.queue.length === 0) ui.view.modal.current = undefined;
    else ui.view.modal.current = ui.view.modal.queue[0];
    ui.view.modal.cloudConflict = [];
  }

  static hideAll() {
    if (!GameUI.initialized) return;
    while (ui.view.modal.queue.length) {
      if (ui.view.modal.queue[0].hide) {
        ui.view.modal.queue[0].hide();
      } else {
        Modal.hide();
      }
    }
    ui.view.modal.current = undefined;
  }

  static get isOpen() {
    return ui.view.modal.current instanceof this;
  }
}

class ChallengeConfirmationModal extends Modal {
  show(id) {
    super.show({ id });
  }
}

class TimeModal extends Modal {
  show(diff) {
    super.show({ diff });
  }
}

// If a new modal which can be shown in the same queue multiple times needs to be added
// Additional code needs to be written to account for that

Modal.startEternityChallenge = new ChallengeConfirmationModal(EternityChallengeStartModal);
Modal.startInfinityChallenge = new ChallengeConfirmationModal(InfinityChallengeStartModal);
Modal.startNormalChallenge = new ChallengeConfirmationModal(NormalChallengeStartModal);

Modal.dimensionBoost = new Modal(DimensionBoostModal, 1, GAME_EVENT.DIMBOOST_AFTER);

Modal.antimatterGalaxy = new Modal(AntimatterGalaxyModal, 1, GAME_EVENT.GALAXY_RESET_AFTER);
Modal.bigCrunch = new Modal(BigCrunchModal, 1, GAME_EVENT.BIG_CRUNCH_AFTER);
Modal.exitChallenge = new Modal(ExitChallengeModal, 1, GAME_EVENT.REALITY_RESET_AFTER);
Modal.replicantiGalaxy = new Modal(ReplicantiGalaxyModal, 1, GAME_EVENT.ETERNITY_RESET_AFTER);
Modal.eternity = new Modal(EternityModal, 1, GAME_EVENT.ETERNITY_RESET_AFTER);
Modal.enterDilation = new Modal(EnterDilationModal, 1, GAME_EVENT.REALITY_RESET_AFTER);
Modal.exitDilation = new Modal(ExitDilationModal, 1, GAME_EVENT.REALITY_RESET_AFTER);
Modal.reality = new Modal(RealityModal, 1, GAME_EVENT.REALITY_RESET_AFTER);
Modal.resetReality = new Modal(ResetRealityModal, 1, GAME_EVENT.REALITY_RESET_AFTER);
Modal.celestials = new Modal(EnterCelestialsModal, 1);
Modal.hardReset = new Modal(HardResetModal, 1);
Modal.backupWindows = new Modal(BackupWindowModal, 1);
Modal.enterSpeedrun = new Modal(SpeedrunModeModal);
Modal.modifySeed = new Modal(ModifySeedModal);
Modal.changeName = new Modal(ChangeNameModal);
Modal.armageddon = new Modal(ArmageddonModal, 1);

Modal.confirmationOptions = new Modal(ConfirmationOptionsModal);
Modal.infoDisplayOptions = new Modal(InfoDisplayOptionsModal);
Modal.awayProgressOptions = new Modal(AwayProgressOptionsModal);
Modal.glyphDisplayOptions = new Modal(GlyphDisplayOptionsModal);
Modal.cosmeticSetChoice = new Modal(CosmeticSetChoiceModal);
Modal.singleGlyphAppearance = new Modal(SingleGlyphAppearanceModal);
Modal.hotkeys = new Modal(HotkeysModal);
Modal.newsOptions = new Modal(NewsOptionsModal);
Modal.animationOptions = new Modal(AnimationOptionsModal);
Modal.hiddenTabs = new Modal(HiddenTabsModal);
Modal.preferredTree = new Modal(PreferredTreeModal);
Modal.notation = new Modal(NotationModal);

Modal.upgradeLock = new Modal(UpgradeMechanicLockModal, 1);
Modal.deleteCompanion = new Modal(DeleteCompanionGlyphModal, 1);
Modal.glyphDelete = new Modal(DeleteGlyphModal, 1, GAME_EVENT.GLYPHS_CHANGED);
Modal.glyphPurge = new Modal(PurgeGlyphModal, 1, GAME_EVENT.GLYPHS_CHANGED);
Modal.glyphSacrifice = new Modal(SacrificeGlyphModal, 1, GAME_EVENT.GLYPHS_CHANGED);
Modal.glyphRefine = new Modal(RefineGlyphModal, 1, GAME_EVENT.GLYPHS_CHANGED);
Modal.deleteAllUnprotectedGlyphs = new Modal(PurgeAllUnprotectedGlyphsModal, 1, GAME_EVENT.GLYPHS_CHANGED);
Modal.deleteAllRejectedGlyphs = new Modal(PurgeAllRejectedGlyphsModal, 1, GAME_EVENT.GLYPHS_CHANGED);

Modal.glyphShowcasePanel = new Modal(GlyphShowcasePanelModal);
Modal.glyphUndo = new Modal(UndoGlyphModal, 1, GAME_EVENT.REALITY_RESET_AFTER);
Modal.glyphReplace = new Modal(ReplaceGlyphModal, 1, GAME_EVENT.REALITY_RESET_AFTER);
Modal.enslavedHints = new Modal(EnslavedHintsModal);
Modal.realityGlyph = new Modal(RealityGlyphCreationModal);
Modal.glyphSetSaveDelete = new Modal(GlyphSetSaveDeleteModal);
Modal.uiChoice = new Modal(UiChoiceModal);
Modal.h2p = new Modal(H2PModal);
Modal.information = new Modal(InformationModal);
Modal.credits = new Modal(CreditsModal, 1);
Modal.changelog = new Modal(ChangelogModal, 1);
Modal.awayProgress = new Modal(AwayProgressModal);
Modal.loadGame = new Modal(LoadGameModal);
Modal.import = new Modal(ImportSaveModal);
Modal.importFilter = new Modal(ImportFilterModal);
Modal.importScriptData = new Modal(ImportAutomatorDataModal);
Modal.automatorScriptDelete = new Modal(DeleteAutomatorScriptModal);
Modal.automatorScriptTemplate = new Modal(AutomatorScriptTemplate);
Modal.switchAutomatorEditorMode = new Modal(SwitchAutomatorEditorModal);
Modal.clearAutomatorConstants = new Modal(ClearConstantsModal);
Modal.importTSConstants = new Modal(ImportTimeStudyConstants);
Modal.autobuyerEditModal = new Modal(AutobuyerEditModal);
Modal.shop = new Modal(StdStoreModal);
Modal.studyString = new Modal(StudyStringModal);
Modal.singularityMilestones = new Modal(SingularityMilestonesModal);
Modal.pelleEffects = new Modal(PelleEffectsModal);
Modal.sacrifice = new Modal(SacrificeModal, 1, GAME_EVENT.DIMBOOST_AFTER);
Modal.breakInfinity = new Modal(BreakInfinityModal, 1, GAME_EVENT.ETERNITY_RESET_AFTER);
Modal.respecIAP = new Modal(RespecIAPModal);
Modal.lc3Help = new Modal(LC3HelpModal, 1, GAME_EVENT.BIG_CRUNCH_AFTER);

Modal.s12Games = new Modal(S12GamesModal);
Modal.message = new class extends Modal {
  show(text, props = {}, messagePriority = 0) {
    if (!GameUI.initialized) return;
    // It might be zero, so explicitly check for undefined
    if (this.currPriority === undefined) this.currPriority = messagePriority;
    else if (messagePriority < this.currPriority) return;

    super.show();
    this.message = text;
    this.callback = props.callback;
    this.closeButton = props.closeButton ?? false;
    EventHub.ui.offAll(this._component);
    if (props.closeEvent) this.applyCloseListeners(props.closeEvent);
  }

  hide() {
    EventHub.ui.offAll(this._component);
    this.currPriority = undefined;
    Modal.hide();
  }
}(MessageModal, 2);
