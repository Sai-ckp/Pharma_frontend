import React from 'react';
import type {Meta, StoryObj} from '@storybook/react';

import {rack_locations} from './rack_locations';

const meta: Meta<typeof rack_locations> = {
  component: rack_locations,
};

export default meta;

type Story = StoryObj<typeof rack_locations>;

export const Basic: Story = {args: {}};
