import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {common} from './common';

const meta: Meta<typeof common> = {
  component: common,
};

export default meta;

type Story = StoryObj<typeof common>;

export const Basic: Story = {args: {}};
