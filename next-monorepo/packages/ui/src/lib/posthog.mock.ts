import { fn } from '@storybook/test';
import * as actual from "posthog-js/react";

export const useFeatureFlagEnabled = fn(actual.useFeatureFlagEnabled).mockName("useFeatureFlagEnabled");