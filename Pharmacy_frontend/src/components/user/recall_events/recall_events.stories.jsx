import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {recall_events} from './recall_events';

const meta: Meta<typeof recall_events> = {
  component: recall_events,
};

export default meta;

type Story = StoryObj<typeof recall_events>;

export const Basic: Story = {args: {}};
