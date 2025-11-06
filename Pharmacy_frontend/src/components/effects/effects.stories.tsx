import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {effects} from './effects';

const meta: Meta<typeof effects> = {
  component: effects,
};

export default meta;

type Story = StoryObj<typeof effects>;

export const Basic: Story = {args: {}};
