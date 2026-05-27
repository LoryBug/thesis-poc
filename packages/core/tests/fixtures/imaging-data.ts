import type { EchoFeatures, CmrFeatures, CtFeatures, PetParameters, ImagingData } from '../../src/types'

export function imagingDataNoExams(): ImagingData {
  return {
    echoAvailable: false,
    echo: null,
    cmrAvailable: false,
    cmr: null,
    ctpetAvailable: false,
    ct: null,
    pet: null,
  }
}

export function imagingDataOnlyEcho(features: EchoFeatures): ImagingData {
  return {
    echoAvailable: true,
    echo: features,
    cmrAvailable: false,
    cmr: null,
    ctpetAvailable: false,
    ct: null,
    pet: null,
  }
}

export function imagingDataEchoAndCmr(
  echoFeatures: EchoFeatures,
  cmrFeatures: CmrFeatures,
): ImagingData {
  return {
    echoAvailable: true,
    echo: echoFeatures,
    cmrAvailable: true,
    cmr: cmrFeatures,
    ctpetAvailable: false,
    ct: null,
    pet: null,
  }
}

export function imagingDataEchoCmrCt(
  echoFeatures: EchoFeatures,
  cmrFeatures: CmrFeatures,
  ctFeatures: CtFeatures,
): ImagingData {
  return {
    echoAvailable: true,
    echo: echoFeatures,
    cmrAvailable: true,
    cmr: cmrFeatures,
    ctpetAvailable: true,
    ct: ctFeatures,
    pet: null,
  }
}

export function imagingDataEchoCmrCtPet(
  echoFeatures: EchoFeatures,
  cmrFeatures: CmrFeatures,
  ctFeatures: CtFeatures,
  petParams: PetParameters,
): ImagingData {
  return {
    echoAvailable: true,
    echo: echoFeatures,
    cmrAvailable: true,
    cmr: cmrFeatures,
    ctpetAvailable: true,
    ct: ctFeatures,
    pet: petParams,
  }
}

export function imagingDataOnlyCt(ctFeatures: CtFeatures): ImagingData {
  return {
    echoAvailable: false,
    echo: null,
    cmrAvailable: false,
    cmr: null,
    ctpetAvailable: true,
    ct: ctFeatures,
    pet: null,
  }
}

export function imagingDataCtAndPet(
  ctFeatures: CtFeatures,
  petParams: PetParameters,
): ImagingData {
  return {
    echoAvailable: false,
    echo: null,
    cmrAvailable: false,
    cmr: null,
    ctpetAvailable: true,
    ct: ctFeatures,
    pet: petParams,
  }
}

export function imagingDataOnlyCmr(cmrFeatures: CmrFeatures): ImagingData {
  return {
    echoAvailable: false,
    echo: null,
    cmrAvailable: true,
    cmr: cmrFeatures,
    ctpetAvailable: false,
    ct: null,
    pet: null,
  }
}
