import { useCallback } from 'react';
import { EMPTY_VALUE } from '../../../shared/constants';

type SetState = (v: string) => void;

export interface HierarchyHandlers {
  handleDivisionChange: (v: string) => void;
  handleUnionChange: (v: string) => void;
  handleAssociationChange: (v: string) => void;
  handleChurchChange: (v: string) => void;
}

interface HierarchySetters {
  setDivision: SetState;
  setUnion: SetState;
  setAssociation: SetState;
  setChurch: SetState;
  setClubId: SetState;
}

export function useHierarchyHandlers(setters: HierarchySetters): HierarchyHandlers {
  const { setDivision, setUnion, setAssociation, setChurch, setClubId } = setters;
  const handleDivisionChange = useCallback(
    (v: string) => {
      setDivision(v);
      setUnion(EMPTY_VALUE);
      setAssociation(EMPTY_VALUE);
      setChurch(EMPTY_VALUE);
      setClubId(EMPTY_VALUE);
    },
    [setDivision, setUnion, setAssociation, setChurch, setClubId]
  );

  const handleUnionChange = useCallback(
    (v: string) => {
      setUnion(v);
      setAssociation(EMPTY_VALUE);
      setChurch(EMPTY_VALUE);
      setClubId(EMPTY_VALUE);
    },
    [setUnion, setAssociation, setChurch, setClubId]
  );

  const handleAssociationChange = useCallback(
    (v: string) => {
      setAssociation(v);
      setChurch(EMPTY_VALUE);
      setClubId(EMPTY_VALUE);
    },
    [setAssociation, setChurch, setClubId]
  );

  const handleChurchChange = useCallback(
    (v: string) => {
      setChurch(v);
      setClubId(EMPTY_VALUE);
    },
    [setChurch, setClubId]
  );

  return {
    handleDivisionChange,
    handleUnionChange,
    handleAssociationChange,
    handleChurchChange,
  };
}
