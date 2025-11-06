import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {settings} from './settings';

const meta: Meta<typeof settings> = {
  component: settings,
};

export default meta;

type Story = StoryObj<typeof settings>;

export const Basic: Story = {args: {}};
