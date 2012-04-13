# AirCasting - Share your Air!
# Copyright (C) 2011-2012 HabitatMap, Inc.
# 
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
# 
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
# 
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.
# 
# You can contact the authors by email at <info@habitatmap.org>

require 'spec_helper'

describe Stream do
	let(:stream) { Factory(:stream) }
	let!(:measurement) { Factory(:measurement, :stream => stream) }

  describe "#destroy" do
    it "should destroy measurements" do
      stream.reload.destroy

      Measurement.exists?(measurement.id).should be_false
    end
  end

  describe "as_json" do
		subject { stream.as_json(:methods => [:measurements]) }

  	it "should include stream size" do
			subject[:size].should == stream.reload.measurements.size
    end
	end
end