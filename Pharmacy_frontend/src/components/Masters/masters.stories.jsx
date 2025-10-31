import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {masters} from './masters';

const meta: Meta<typeof masters> = {
  component: masters,
};

export default meta;

type Story = StoryObj<typeof masters>;

export const Basic: Story = {args: {}};
