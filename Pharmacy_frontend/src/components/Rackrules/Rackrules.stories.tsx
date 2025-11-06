import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {Rackrules} from './Rackrules';

const meta: Meta<typeof Rackrules> = {
  component: Rackrules,
};

export default meta;

type Story = StoryObj<typeof Rackrules>;

export const Basic: Story = {args: {}};
