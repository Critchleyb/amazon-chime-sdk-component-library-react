// Copyright 2020-2021 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { useState, useEffect } from 'react';
import { ClientMetricReport } from 'amazon-chime-sdk-js';

import { useAudioVideo } from '../../providers/AudioVideoProvider';

interface AttendeeVideoMetrics { 
  streams: { [id: string]: {[key: string]: number} };
};

export function useAttendeeVideoMetrics(attendeeId: string) {
  const audioVideo = useAudioVideo();
  const [metrics, setMetrics] = useState<AttendeeVideoMetrics>({
    streams: {},
  });

  useEffect(() => {
    if (!audioVideo) {
      return;
    }

    const observer = {
      metricsDidReceive(clientMetricReport: ClientMetricReport): void {
        const videoMetricReport = clientMetricReport.getObservableVideoMetrics();
        setMetrics({
          streams: videoMetricReport[attendeeId],
        });
      },
    }

    audioVideo.addObserver(observer);

    return () => audioVideo.removeObserver(observer);
  }, [audioVideo]);

  return metrics;
}

export default useAttendeeVideoMetrics;
