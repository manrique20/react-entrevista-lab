'use client';

import React from 'react';
import * as Level1 from './level1Demos';
import * as Level2 from './level2Demos';
import * as Level3 from './level3Demos';
import * as Level4 from './level4Demos';
import * as Level5 from './level5Demos';
import * as Level6 from './level6Demos';
import * as Level7 from './level7Demos';
import * as Level8 from './level8Demos';
import { Sparkles } from 'lucide-react';

interface TopicDemoDispatcherProps {
  componentKey: string;
  topicTitle: string;
}

export function TopicDemoDispatcher({ componentKey, topicTitle }: TopicDemoDispatcherProps) {
  // Level 1
  if (componentKey === 'VirtualDomDemo') return <Level1.VirtualDomDemo />;
  if (componentKey === 'JsxExpressionsDemo') return <Level1.JsxExpressionsDemo />;
  if (componentKey === 'FunctionalVsClassDemo') return <Level1.FunctionalVsClassDemo />;
  if (componentKey === 'PropsAndChildrenDemo') return <Level2.CompositionVsInheritanceDemo />;
  if (componentKey === 'ListKeysTrapDemo') return <Level1.ListKeysTrapDemo />;
  if (componentKey === 'ConditionalRenderingDemo') return <Level1.ConditionalRenderingDemo />;
  if (componentKey === 'EventsDemo') return <Level1.EventsDemo />;
  if (componentKey === 'StylesComparisonDemo') return <Level1.StylesComparisonDemo />;
  if (componentKey === 'DataFlowDemo') return <Level1.DataFlowDemo />;

  // Level 2
  if (componentKey === 'UseStateAsyncDemo') return <Level2.UseStateAsyncDemo />;
  if (componentKey === 'UseEffectLifecycleDemo') return <Level2.UseEffectLifecycleDemo />;
  if (componentKey === 'ControlledVsUncontrolledDemo') return <Level2.ControlledVsUncontrolledDemo />;
  if (componentKey === 'FormValidationDemo') return <Level2.FormValidationDemo />;
  if (componentKey === 'LiftingStateDemo') return <Level2.LiftingStateDemo />;
  if (componentKey === 'CompositionVsInheritanceDemo') return <Level2.CompositionVsInheritanceDemo />;
  if (componentKey === 'UseRefDomAndStateDemo') return <Level2.UseRefDomAndStateDemo />;
  if (componentKey === 'HooksRulesAndLinkedListDemo') return <Level2.HooksRulesAndLinkedListDemo />;

  // Level 3
  if (componentKey === 'ContextRerenderDemo') return <Level3.ContextRerenderDemo />;
  if (componentKey === 'UseReducerDemo') return <Level3.UseReducerDemo />;
  if (componentKey === 'MemoCallbackProfilerDemo') return <Level3.MemoCallbackProfilerDemo />;
  if (componentKey === 'CustomHooksPlaygroundDemo') return <Level3.CustomHooksPlaygroundDemo />;
  if (componentKey === 'LifecyclePipelineDemo') return <Level8.RenderCommitPhasesDemo />;
  if (componentKey === 'DiffingHeuristicsDemo') return <Level3.DiffingHeuristicsDemo />;
  if (componentKey === 'DataFetchingRaceDemo') return <Level3.DataFetchingRaceDemo />;
  if (componentKey === 'RouterSimulatorDemo') return <Level3.RouterSimulatorDemo />;
  if (componentKey === 'ErrorBoundaryDemo') return <Level3.ErrorBoundaryDemo />;
  if (componentKey === 'PortalModalDemo') return <Level3.PortalModalDemo />;
  if (componentKey === 'ForwardRefImperativeDemo') return <Level3.ForwardRefImperativeDemo />;
  if (componentKey === 'CompositionPatternsDemo') return <Level3.CompositionPatternsDemo />;
  if (componentKey === 'VirtualizationDemo') return <Level3.VirtualizationDemo />;

  // Level 4
  if (componentKey === 'ReduxSimulatorDemo') return <Level4.ReduxSimulatorDemo />;
  if (componentKey === 'ZustandStoreDemo') return <Level4.ZustandStoreDemo />;
  if (componentKey === 'TanStackQueryDemo') return <Level4.TanStackQueryDemo />;
  if (componentKey === 'HookFormZodDemo') return <Level4.HookFormZodDemo />;
  if (componentKey === 'UiLibrariesDemo') return <Level4.UiLibrariesDemo />;
  if (componentKey === 'TypeScriptReactDemo') return <Level4.TypeScriptReactDemo />;
  if (componentKey === 'TestingStrategyDemo') return <Level4.TestingStrategyDemo />;
  if (componentKey === 'AccessibilityAuditDemo') return <Level4.AccessibilityAuditDemo />;
  if (componentKey === 'I18nLocalizationDemo') return <Level4.I18nLocalizationDemo />;

  // Level 5
  if (componentKey === 'ProfilerDemo') return <Level5.ProfilerDemo />;
  if (componentKey === 'PreventRerendersDemo') return <Level5.PreventRerendersDemo />;
  if (componentKey === 'CodeSplittingDemo') return <Level5.CodeSplittingDemo />;
  if (componentKey === 'ImageOptimizationDemo') return <Level5.ImageOptimizationDemo />;
  if (componentKey === 'BundleTreeShakingDemo') return <Level5.BundleTreeShakingDemo />;
  if (componentKey === 'WebVitalsDemo') return <Level5.WebVitalsDemo />;
  if (componentKey === 'DebounceThrottleDemo') return <Level5.DebounceThrottleDemo />;
  if (componentKey === 'WebWorkerDemo') return <Level5.WebWorkerDemo />;
  if (componentKey === 'StateStructureDemo') return <Level5.StateStructureDemo />;

  // Level 6
  if (componentKey === 'ConcurrentRenderingDemo') return <Level6.ConcurrentRenderingDemo />;
  if (componentKey === 'AutomaticBatchingDemo') return <Level6.AutomaticBatchingDemo />;
  if (componentKey === 'UseTransitionDemo') return <Level6.UseTransitionDemo />;
  if (componentKey === 'UseIdAndExternalStoreDemo') return <Level6.UseIdAndExternalStoreDemo />;
  if (componentKey === 'SuspenseDataDemo') return <Level6.SuspenseDataDemo />;
  if (componentKey === 'StreamingSsrDemo') return <Level6.StreamingSsrDemo />;
  if (componentKey === 'RscBoundariesDemo') return <Level6.RscBoundariesDemo />;
  if (componentKey === 'ServerActionsDemo') return <Level6.ServerActionsDemo />;
  if (componentKey === 'React19HooksDemo') return <Level6.React19HooksDemo />;
  if (componentKey === 'React19RefPropDemo') return <Level6.React19RefPropDemo />;
  if (componentKey === 'ReactCompilerDemo') return <Level6.ReactCompilerDemo />;
  if (componentKey === 'StrictModeDemo') return <Level6.StrictModeDemo />;

  // Level 7
  if (componentKey === 'RenderingStrategiesDemo') return <Level7.RenderingStrategiesDemo />;
  if (componentKey === 'NextJsArchitectureDemo') return <Level7.NextJsArchitectureDemo />;
  if (componentKey === 'FrameworksComparisonDemo') return <Level7.FrameworksComparisonDemo />;
  if (componentKey === 'FolderArchitectureDemo') return <Level7.FolderArchitectureDemo />;
  if (componentKey === 'MonorepoStructureDemo') return <Level7.MonorepoStructureDemo />;
  if (componentKey === 'MicrofrontendsDemo') return <Level7.MicrofrontendsDemo />;
  if (componentKey === 'DesignSystemStoryDemo') return <Level7.DesignSystemStoryDemo />;
  if (componentKey === 'AuthSecurityFlowDemo') return <Level7.AuthSecurityFlowDemo />;
  if (componentKey === 'XssSanitizationDemo') return <Level7.XssSanitizationDemo />;

  // Level 8
  if (componentKey === 'FiberTreeVisualizerDemo') return <Level8.FiberTreeVisualizerDemo />;
  if (componentKey === 'RenderCommitPhasesDemo') return <Level8.RenderCommitPhasesDemo />;
  if (componentKey === 'SchedulerLanesDemo') return <Level8.SchedulerLanesDemo />;
  if (componentKey === 'HooksInternalsDemo') return <Level8.HooksInternalsDemo />;
  if (componentKey === 'StaleClosuresDemo') return <Level8.StaleClosuresDemo />;
  if (componentKey === 'SetStateBatchingAsyncDemo') return <Level8.SetStateBatchingAsyncDemo />;
  if (componentKey === 'WhyRerenderBailoutDemo') return <Level8.WhyRerenderBailoutDemo />;
  if (componentKey === 'LayoutEffectFlickerDemo') return <Level8.LayoutEffectFlickerDemo />;
  if (componentKey === 'HydrationMismatchDemo') return <Level8.HydrationMismatchDemo />;
  if (componentKey === 'CustomHooksFromScratchDemo') return <Level8.CustomHooksFromScratchDemo />;

  // Fallback didáctico
  return (
    <div className="p-4 border rounded-xl bg-card text-xs space-y-2">
      <div className="flex items-center gap-2 text-primary font-semibold">
        <Sparkles className="w-4 h-4" />
        <span>Laboratorio Interactivo Activo: {topicTitle}</span>
      </div>
      <p className="text-muted">
        Este concepto se complementa directamente con la suite de ejercicios prácticos de código y las preguntas de simulación de entrevistas.
      </p>
    </div>
  );
}
